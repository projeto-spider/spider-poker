import { connect } from 'react-redux';
import StoryActions from '../components/StoryActions';
import { edit, select, confirmRemove } from '../reducers/stories';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  editStory(id) {
    dispatch(edit(id));
  },
  selectStory(id) {
    dispatch(select(id));
  },
  confirmRemoveStory(id) {
    dispatch(confirmRemove(id));
  },
});

const AvailableStoryActions = connect(
  mapStateToProps,
  mapDispatchToProps
)(StoryActions);

export default AvailableStoryActions;

