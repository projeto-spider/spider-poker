import {connect} from 'react-redux';
import StoryActions from '../components/StoryActions';
import {selectStory, confirmRemoveStory} from '../reducers/config';
import {editStory} from '../reducers/stories';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  editStory(id) {
    dispatch(editStory(id));
  },
  selectStory(id) {
    dispatch(selectStory(id));
  },
  confirmRemoveStory(id) {
    dispatch(confirmRemoveStory(id));
  }
});

const AvailableStoryActions = connect(
  mapStateToProps,
  mapDispatchToProps
)(StoryActions);

export default AvailableStoryActions;

