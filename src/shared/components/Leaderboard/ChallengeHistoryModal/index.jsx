import React, { Component } from 'react';
import { Modal } from 'topcoder-react-ui-kit';
import PT from 'prop-types';
import LoadingIndicator from 'components/LoadingIndicator';
import { config } from 'topcoder-react-utils';
import cn from 'classnames';
import _ from 'lodash';
import theme from './styles.scss';
import PodiumSpot from '../PodiumSpot';

class ChallengeHistoryModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortParam: {
        order: '',
        field: '',
      },
    };
  }

  render() {
    const {
      challenges,
      competitor,
      onCancel,
      loading,
      isCopilot,
      isAlgo,
    } = this.props;
    const { sortParam } = this.state;
    const challengesOrdered = _.orderBy(challenges, [sortParam.field], [sortParam.order]);

    return (
      <Modal onCancel={onCancel} theme={theme}>
        <h3>
          Completed Challenges History
        </h3>
        <div styleName="podium-spot-wrapper">
          <PodiumSpot
            competitor={competitor}
            isCopilot={isCopilot}
            isAlgo={isAlgo}
            themeName="TCO20"
          />
        </div>
        <table styleName="history-table">
          <thead>
            <tr>
              <th>Challenge Name</th>
              {
                !isCopilot ? (
                  <th>
                    <div styleName="header-table-content">
                      <span>Placement</span>
                      <button
                        styleName="sort-container"
                        onClick={() => {
                          if (!sortParam.field || sortParam.field !== 'place') {
                            sortParam.field = 'place';
                            sortParam.order = 'desc';
                          } else {
                            sortParam.order = sortParam.order === 'asc' ? 'desc' : 'asc';
                          }
                          this.setState({ sortParam });
                        }}
                        type="button"
                      >
                        <div styleName={cn('sort-up', {
                          active: sortParam.field === 'place' && sortParam.order === 'asc',
                        })}
                        />
                        <div styleName={cn('sort-down', {
                          active: sortParam.field === 'place' && sortParam.order === 'desc',
                        })}
                        />
                      </button>
                    </div>
                  </th>
                ) : null
              }
              <th>
                <div styleName="header-table-content">
                  <span>TCO Points</span>
                  <button
                    styleName="sort-container"
                    onClick={() => {
                      if (!sortParam.field || sortParam.field !== 'points') {
                        sortParam.field = 'points';
                        sortParam.order = 'desc';
                      } else {
                        sortParam.order = sortParam.order === 'asc' ? 'desc' : 'asc';
                      }
                      this.setState({ sortParam });
                    }}
                    type="button"
                  >
                    <div styleName={cn('sort-up', {
                      active: sortParam.field === 'points' && sortParam.order === 'asc',
                    })}
                    />
                    <div styleName={cn('sort-down', {
                      active: sortParam.field === 'points' && sortParam.order === 'desc',
                    })}
                    />
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {
              challengesOrdered.map(challenge => (
                <tr styleName="row" key={`${challenge.challenge_id}`}>
                  <td styleName="name">
                    <a href={`${config.URL.BASE}/challenges/${challenge.challenge_id}/`} styleName="link" target="_blank" rel="noopener noreferrer">
                      {challenge.challenge_name || challenge.challenge_id}
                    </a>
                  </td>
                  {
                    !isCopilot ? (
                      <td styleName="placement">{challenge.place}</td>
                    ) : null
                  }
                  <td styleName="points">
                    {challenge.points}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        {
          loading ? <LoadingIndicator /> : null
        }
        <div styleName="buttons">
          <button onClick={onCancel} type="button" styleName="close-btn">
            Return to page
          </button>
        </div>
      </Modal>
    );
  }
}

const CHALLENGES_TYPE = PT.arrayOf(PT.shape({
  challenge_name: PT.string.isRequired,
  place: PT.number,
  points: PT.number.isRequired,
}));

const CompetitorShape = PT.shape({
  rank: PT.number.isRequired,
  avatar: PT.string,
  handle: PT.string.isRequired,
  challengecount: PT.number.isRequired,
  points: PT.number.isRequired,
});

ChallengeHistoryModal.defaultProps = {
  isCopilot: false,
  isAlgo: false,
};

ChallengeHistoryModal.propTypes = {
  challenges: CHALLENGES_TYPE.isRequired,
  competitor: CompetitorShape.isRequired,
  onCancel: PT.func.isRequired,
  loading: PT.bool.isRequired,
  isAlgo: PT.bool,
  isCopilot: PT.bool,
};

export default ChallengeHistoryModal;
