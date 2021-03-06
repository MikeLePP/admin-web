import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import cn from 'classnames';
import { map } from 'lodash';
import { OnboardingSteps } from './OnboardingSteps';

const ApprovalStatus = ({ summaries }: { summaries: OnboardingSteps }): JSX.Element => {
  const getStatusIcon = (completed?: boolean) => {
    if (completed === true) {
      return <CheckCircleIcon color="secondary" />;
    }
    if (completed === false) {
      return <CancelOutlinedIcon color="error" />;
    }
    return <CheckCircleOutlineIcon />;
  };
  return (
    <div className="pt-8">
      <Typography variant="subtitle2" className="font-bold">
        Approval Status
      </Typography>

      <List>
        {map(summaries, (s) => (
          <ListItem key={s.name}>
            <ListItemIcon>{getStatusIcon(s.completed)}</ListItemIcon>
            <ListItemText disableTypography>
              <Typography
                className={cn({
                  'font-bold': s.completed !== undefined,
                  'text-gray-500': s.completed === undefined,
                })}
              >
                {s.name}
              </Typography>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ApprovalStatus;
