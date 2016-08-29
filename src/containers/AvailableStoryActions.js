import {connect} from 'react-redux';
import StoryActions from '../components/StoryActions';
import {editStory} from '../reducers/stories';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  editStory(id) {
    dispatch(editStory(id));
  }
});

const AvailableStoryActions = connect(
  mapStateToProps,
  mapDispatchToProps
)(StoryActions);

export default AvailableStoryActions;

