import { IconButton, Typography } from '@material-ui/core';
import { EditOutlined as EditIcon } from '@material-ui/icons';
import { useHistory } from 'react-router';
import TextLabel from '../../components/TextLabel';
import { getFullname } from '../../helpers/string';
import { User } from '../../types/user';

export interface CustomerInfoProps {
  userDetails: User;
  children: React.ReactNode;
}

export default ({ userDetails, children }: CustomerInfoProps): JSX.Element => {
  const { email, mobileNumber } = userDetails;
  const fullName = getFullname(userDetails);
  const history = useHistory();

  const handleEditUserClick = () => {
    history.push(`/users/${String(userDetails.id)}`);
  };

  return (
    <div className="flex flex-col p-4 md:py-8">
      <div className="flex justify-between mb-4 items-center">
        <Typography variant="h5">{fullName}</Typography>
        <IconButton onClick={handleEditUserClick}>
          <EditIcon />
        </IconButton>
      </div>
      <div className="space-y-4 mb-8">
        <TextLabel label="Email" value={email} />
        <TextLabel label="Mobile" value={mobileNumber} />
      </div>

      {children}
    </div>
  );
};
