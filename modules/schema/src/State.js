export let typeDefs = `
  type AggState {
    field: String
    type: String
    active: Boolean
    show: Boolean
  }

  type AggsState {
    timestamp: String
    state: [AggState]
  }

  type AggsStates {
    index: String
    states: [AggsState]
  }

  type ColumnSort {
    id: String
    desc: Boolean
  }

  type Column {
    show: Boolean
    type: String
    sortable: Boolean
    canChangeShow: Boolean
    query: String
    jsonPath: String
    id: String
    field: String
    accessor: String
  }

  type ColumnState {
    type: String
    keyField: String
    defaultSorted: [ColumnSort]
    columns: [Column]
  }

  type ColumnsState {
    state: ColumnState
    timestamp: String
  }

  type ColumnsStates {
    index: String
    states: [ColumnsState]
  }

  type MatchBoxField {
    displayName: String
    field: String
    isActive: Boolean
    keyField: String
    searchFields: [String]
  }

  type MatchBoxState {
    state: [MatchBoxField]
    timestamp: String
  }

  type MatchBoxStates {
    index: String
    states: [MatchBoxState]
  }
`;
