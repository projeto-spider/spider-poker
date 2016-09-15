import { connect } from 'react-redux';
import StoryDialog from '../components/StoryDialog';
import { add, manipulate, closeStoryModal } from '../reducers/stories';

const mapStateToProps = state => {
  const modal = state
    .getIn(['stories', 'dialogs', 'manipulate']);
  const current = modal.get('story');

  const story = state.getIn(['stories', 'list']).filter(
    story => story.get('id') === current
  ).last();

  return {
    open: modal.get('open'),
    story: story ? story.toJS() : {},
  };
};

const mapDispatchToProps = dispatch => ({
  addStory(story) {
    dispatch(add(story));
  },
  manipulateStory(story) {
    dispatch(manipulate(story));
  },
  close() {
    dispatch(closeStoryModal());
  },
});

const StoryDialogContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StoryDialog);

export default StoryDialogContainer;

