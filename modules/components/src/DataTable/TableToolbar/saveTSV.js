import { get, flatten } from 'lodash';
import { createWriteStream, supported } from 'streamsaver';
import { saveAs } from 'file-saver';
import Tar from 'tar-js';

import { getAllValue } from '../utils';

function streamMethods(fileName) {
  const fileStream = createWriteStream(fileName);
  const writer = fileStream.getWriter();
  const encoder = new TextEncoder();

  return {
    onData: data => {
      let uint8array = encoder.encode(data);
      writer.write(uint8array);
    },
    onEnd: () => {
      writer.close();
    },
  };
}

function noStreamMethods(fileName, tar) {
  let data = '';
  return {
    onData: chunk => {
      data = data + chunk;
    },
    onEnd: () => {
      if (tar) {
        tar.append('output.txt', data);
      } else {
        saveAs(
          new Blob([data], { type: 'text/tab-separated-values' }),
          fileName,
        );
      }
    },
  };
}

function getValue(row, column) {
  if (column.accessor) {
    return get(row, column.accessor);
  } else if (column.type === 'list') {
    return get(row, column.listAccessor)
      .map(getAllValue)
      .reduce((a, b) => a.concat(b), [])
      .join(', ');
  } else {
    return '';
  }
}

function getRows(args) {
  const {
    row,
    data = row,
    paths,
    pathIndex = 0,
    columns,
    entities = [],
  } = args;
  if (pathIndex >= paths.length - 1) {
    return [
      columns.map(column => {
        const entity = entities
          .slice()
          .reverse()
          .find(entity => column.field.indexOf(entity.field) === 0);

        if (entity) {
          return get(
            entity.data,
            // TODO: don't assume all edges will start with node
            'node.' + column.field.replace(entity.field, '').replace(/^\./, ''),
          );
        } else {
          return getValue(row, column);
        }
      }),
    ];
  } else {
    const currentPath = paths[pathIndex];
    return flatten(
      (get(data, currentPath) || []).map(node => {
        return getRows({
          ...args,
          data: node,
          pathIndex: pathIndex + 1,
          entities: [
            ...entities,
            {
              field: paths
                .slice(0, pathIndex + 1)
                .join('')
                // TODO: don't assume hits.edges.node.
                .replace(/(\.hits.edges(node)?)/g, ''),
              data: node,
            },
          ],
        });
      }),
    );
  }
}

function streamFile({
  columns,
  streamData,
  uniqueBy = '',
  sqon,
  onData,
  onEnd,
}) {
  const columnsShowing = columns.filter(c => c.show);
  const data = columnsShowing.map(column => column.Header).join('\t');
  onData(data + '\n');

  return streamData({
    columns: columnsShowing,
    sort: [],
    first: 1000,
    sqon,
    onData: chunk => {
      const data = flatten(
        chunk.data.map(row => {
          return getRows({
            row,
            paths: uniqueBy.split('[].').filter(Boolean),
            columns: columnsShowing,
          }).map(row => row.join('\t'));
        }),
      ).join('\n');

      onData(data + '\n');
    },
    onEnd,
  });
}

export default async function({
  streamData,
  shouldStream = supported,
  files = [],
  fileName = 'files.tar',
}) {
  if (!files.length) {
    console.warn('no files defined to download');
    return;
  }

  const tar = files.length > 1 && new Tar(); // if multiple files, lets zip em up!

  const callBacks =
    shouldStream && files.length === 1 ? streamMethods : noStreamMethods; // we can't zip and stream the download

  await Promise.all(
    files.map((file, i) =>
      streamFile({
        streamData,
        ...file,
        ...callBacks(file.fileName || `file-${i + 1}.txt`, tar),
      }),
    ),
  );

  if (tar) {
    saveAs(new Blob([tar.out], { type: 'application/gzip' }), fileName);
  }
}
