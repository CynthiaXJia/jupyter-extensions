import * as React from 'react';
import { withStyles, Tabs, Tab } from '@material-ui/core';
import { gColor } from './styles';

export const StyledTabs = props => {
  return (
    <ColorTabs color={gColor('BLUE')} {...props}>
      {props.children}
    </ColorTabs>
  );
};

interface ColorTabsProps {
  color: string;
  // children: any;
  value: string | number;
  onChange: any;
}

const ColorTabs: React.ComponentType<any> = withStyles({
  root: {
    borderBottom: '1px solid var(--jp-border-color2)',
    minHeight: 'auto',
    padding: 0,
  },
  indicator: {
    backgroundColor: (props: ColorTabsProps) => props.color,
    height: '2.5px',
  },
})(Tabs);

export const StyledTab: React.SFC<{ label: string }> = props => {
  return <ColorTab color={gColor('BLUE')} label={props.label} />;
};

const ColorTab: React.ComponentType<ColorTabProps> = withStyles({
  root: {
    textTransform: 'none',
    minWidth: 'auto',
    minHeight: 'auto',
    fontSize: '13px',
    '&:hover': {
      color: (props: ColorTabProps) => props.color,
      opacity: 1,
    },
    '&$selected': {
      color: (props: ColorTabProps) => props.color,
    },
    '&:focus': {
      color: (props: ColorTabProps) => props.color,
    },
  },
  selected: {},
})((props: ColorTabProps) => <Tab disableRipple {...props} />);

interface ColorTabProps {
  label: string;
  color: string;
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
