import { connect } from 'react-redux';
import StoryList from '../components/StoryList';

const mapStateToProps = state => ({
  stories: state.getIn(['stories', 'list']).toJS(),
  currentStory: state.getIn(['stories', 'current']),
});

const VisibleStories = connect(
  mapStateToProps
)(StoryList);

export default VisibleStories;

