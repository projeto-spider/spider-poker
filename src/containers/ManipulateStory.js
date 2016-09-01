import {connect} from 'react-redux';
import StoryDialog from '../components/StoryDialog';
import {closeStoryModal} from '../reducers/config';
import {addStory, manipulateStory} from '../reducers/stories';

const mapStateToProps = state => {
  const story = state.get('stories').filter(
    story => story.get('id') === state.getIn(['config', 'storyModal', 'story'])
  ).last();

  return {
    open: state.getIn(['config', 'storyModal', 'open']),
    story: story ? story.toJS() : {}
  };
};

const mapDispatchToProps = dispatch => ({
  addStory(story) {
    dispatch(addStory(story));
  },
  manipulateStory(story) {
    dispatch(manipulateStory(story));
  },
  close() {
    dispatch(closeStoryModal());
  }
});

const StoryDialogContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StoryDialog);

export default StoryDialogContainer;

