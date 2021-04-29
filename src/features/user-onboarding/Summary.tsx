import { Fragment, useState } from 'react';
import { Typography, Button } from '@material-ui/core';
import { map, every } from 'lodash';
import { useHistory } from 'react-router-dom';

import TextLabel from '../../components/TextLabel';
import { callApi } from '../../helpers/api';
import { getFullname } from '../../helpers/string';

export default ({
  summaries,
  onPrevStep,
  userDetails,
  identity,
  notify,
}: Record<string, unknown>): JSX.Element => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const allCompleted = every(summaries, 'completed');
  const getValue = (value: any) => {
    let result = '-';
    if (value && (typeof value === 'string' || typeof value === 'number')) {
      result = value.toString();
    } else if (typeof value === 'boolean') {
      result = value === true ? 'Yes' : 'No';
    }
    return result;
  };

  const handleCompleteClick = async (approved: boolean) => {
    try {
      setLoading(true);
      await callApi(`/onboarding/${String(userDetails.id)}`, 'post', {
        step: 'complete',
        approved,
        updatedBy: identity?.id,
      });
      history.push('/users');
      notify(`${getFullname(userDetails)} has been ${approved ? 'Approved' : 'Rejected'}!`);
    } catch (error) {
      notify(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="px-8 mb-8">
        <Typography variant="h6" className="mb-4">
          Summary
        </Typography>
        {map(Object.values(summaries), ({ name, values, labels }) => (
          <div className="mb-8" key={name}>
            <Typography variant="subtitle2" className="font-bold mb-4">
              {name}
            </Typography>

            <div className="flex flex-col space-y-3">
              {map(labels, (label, key) => (
                <TextLabel
                  key={key}
                  label={`${String(label)}:`}
                  value={getValue(values[key])}
                  horizontal
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div
        className="flex justify-between px-8 py-6 border-t fixed bg-white z-10"
        style={{ width: 'calc(100% - 1.8125rem - 16rem - 15rem)', bottom: '1.5rem' }}
      >
        <Button variant="outlined" onClick={onPrevStep} disabled={loading}>
          Back
        </Button>
        <div className="space-x-2">
          {allCompleted ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleCompleteClick(true)}
              disabled={loading}
            >
              Approve customer
            </Button>
          ) : (
            <Fragment>
              <Button
                variant="outlined"
                onClick={() => handleCompleteClick(false)}
                disabled={loading}
                classes={{
                  outlined: 'text-red-500 border-red-500',
                  contained: 'bg-red-500 text-white',
                }}
              >
                Reject customer
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => history.push('/users')}
                disabled={loading}
              >
                Done
              </Button>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};
