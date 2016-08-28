import {connect} from 'react-redux';
import StoryActions from '../components/StoryActions';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

const AvailableStoryActions = connect(
  mapStateToProps,
  mapDispatchToProps
)(StoryActions);

export default AvailableStoryActions;

