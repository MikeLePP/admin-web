import { cloneElement } from 'react';
import {
  CreateButton,
  ExportButton,
  ListButton,
  RefreshButton,
  TopToolbar,
  useListContext,
} from 'react-admin';
import { Box } from '@material-ui/core';
import { ArrowBack as BackIcon } from '@material-ui/icons';

interface ListToolbarProps {
  filters?: JSX.Element;
  maxResults?: number;
  to?: string;
}

const ListToolbar = (props: ListToolbarProps): JSX.Element => {
  const { filters, maxResults, to } = props;
  const { currentSort, resource, displayedFilters, filterValues, showFilter, total } =
    useListContext();
  return (
    <TopToolbar className="flex flex-1">
      {filters &&
        cloneElement(filters, {
          resource,
          showFilter,
          displayedFilters,
          filterValues,
          context: 'button',
        })}
      <ListButton basePath="/users" label="Users" icon={<BackIcon />} />
      <Box display="flex" flexGrow={1} />
      <CreateButton to={to} />
      <RefreshButton />
      <ExportButton
        disabled={total === 0}
        resource={resource}
        sort={currentSort}
        filterValues={filterValues}
        maxResults={maxResults}
      />
    </TopToolbar>
  );
};

export default ListToolbar;
