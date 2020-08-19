import * as React from 'react';
import { withStyles, Tabs, Tab } from '@material-ui/core';
import { gColor } from './styles';

export const StyledTabs: React.ComponentType<any> = withStyles({
  root: {
    borderBottom: '1px solid var(--jp-border-color2)',
    minHeight: 'auto',
    padding: 0,
  },
  indicator: {
    height: '2.5px',
    backgroundColor: gColor('BLUE'),
  },
})(Tabs);

// TODO: Style for dark mode
export const StyledTab: React.ComponentType<StyledTabProps> = withStyles({
  root: {
    textTransform: 'none',
    minWidth: 'auto',
    minHeight: 'auto',
    fontSize: '13px',
    '&:hover': {
      color: gColor('BLUE'),
      opacity: 1,
    },
    '&$selected': {
      color: gColor('BLUE'),
    },
    '&:focus': {
      color: gColor('BLUE'),
    },
  },
  selected: {},
})((props: StyledTabProps) => <Tab disableRipple {...props} />);

interface StyledTabProps {
  label: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  TabInds: any;
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, TabInds } = props;

  return (
    <div
      id={`tabpanel-${index}`}
      style={{
        flex: 1,
        minHeight: 0,
        flexDirection: 'column',
        display: value !== index ? 'none' : 'flex',
        overflowX: value === TabInds.preview ? 'auto' : 'hidden',
        overflowY: 'auto',
      }}
    >
      {children}
    </div>
  );
}
