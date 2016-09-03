import {connect} from 'react-redux';
import FloatingButton from '../components/FloatingButton';
import {edit} from '../reducers/stories';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  addStory() {
    dispatch(edit(-1));
  }
});

const FloatingActions = connect(
  mapStateToProps,
  mapDispatchToProps
)(FloatingButton);

export default FloatingActions;

