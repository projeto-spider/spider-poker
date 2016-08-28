import {connect} from 'react-redux';
import StoryList from '../components/StoryList';

const mapStateToProps = state => ({
  stories: state.stories,
  currentStory: state.config.currentStory
});

const VisibleStories = connect(
  mapStateToProps
)(StoryList);

export default VisibleStories;

