import {connect} from 'react-redux';
import StoryDialog from '../components/StoryDialog';
import {closeStoryModal} from '../reducers/config';
import {addStory, manipulateStory} from '../reducers/stories';

const mapStateToProps = state => ({
  open: state.config.storyModal.open,
  story: state.stories.filter(
    story => story.id === state.config.storyModal.story
  ).pop()
});

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

