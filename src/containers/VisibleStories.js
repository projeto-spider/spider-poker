import {connect} from 'react-redux';
import StoryList from '../components/StoryList';

const mapStateToProps = state => ({
  stories: state.get('stories').toJS(),
  currentStory: state.get('config').get('currentStory')
});

const VisibleStories = connect(
  mapStateToProps
)(StoryList);

export default VisibleStories;

