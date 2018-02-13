const EQ = '=',
  NEQ = '!=',
  IN = 'in',
  EXCLUDE = 'exclude',
  EXCLUDE_IF_ANY = 'excludeifany',
  FILTER = 'filter',
  GT = '>',
  GTE = '>=',
  LT = '<',
  LTE = '<=',
  AND = 'and',
  OR = 'or',
  IS = 'is',
  NOT = 'not',
  RANGE_OPS = [GT, LT, GTE, LTE],
  HAVE_OPS = [EQ, IN],
  HAVE_NOT_OPS = [NEQ, EXCLUDE],
  IS_OPS = [IS, NOT],
  GROUP_OPS = [AND, OR];

export const CONSTANTS = {
  EQ: EQ,
  NEQ: NEQ,
  IN: IN,
  EXCLUDE: EXCLUDE,
  EXCLUDE_IF_ANY: EXCLUDE_IF_ANY,
  FILTER: FILTER,
  GT: GT,
  GTE: GTE,
  LT: LT,
  LTE: LTE,
  AND: AND,
  OR: OR,
  IS: IS,
  NOT: NOT,
  HAVE_OPS: HAVE_OPS,
  HAVE_NOT_OPS: HAVE_NOT_OPS,
  IS_OPS: IS_OPS,
  VALUE_OPS: HAVE_OPS.concat(HAVE_NOT_OPS).concat([EXCLUDE_IF_ANY]),
  MUST_OPS: HAVE_OPS.concat(IS_OPS).concat([FILTER]),
  MUST_NOT_OPS: HAVE_NOT_OPS.concat([EXCLUDE_IF_ANY]),
  GROUP_OPS: GROUP_OPS,
  RANGE_OPS: RANGE_OPS,
  ES_RANGE_OPS: { [GT]: 'gt', [LT]: 'lt', [GTE]: 'gte', [LTE]: 'lte' },
  ES_MUST: 'must',
  ES_MUST_NOT: 'must_not',
  ES_SHOULD: 'should',
  ES_NESTED: 'nested',
  ES_BOOL: 'bool',
  ES_FILTER: 'filter',
  ES_QUERY: 'query',
  ES_PATH: 'path',
  ES_MULTI_MATCH: 'multi_match',
  ES_FIELDS: 'fields',
  ES_TYPE: 'type',
  ES_PHRASE_PREFIX: 'phrase_prefix',
  FIELD_TO_SET_TYPE: {
    'cases.case_id': 'case_set',
    'files.file_id': 'file_set',
    'genes.gene_id': 'gene_set',
    'ssms.ssm_id': 'ssm_set',
    'files.index_files.file_id': 'file_set',
    'files.analysis.input_files.file_id': 'file_set',
    'files.downstream_analyses.output_files.file_id': 'file_set',
  },
  BUCKETS: 'buckets',
  STATS: 'stats',
  HISTOGRAM: 'histogram',
};
