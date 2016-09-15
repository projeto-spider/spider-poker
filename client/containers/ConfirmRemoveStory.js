import { connect } from 'react-redux';
import RemoveStoryDialog from '../components/RemoveStoryDialog';
import { remove, closeRemoveModal } from '../reducers/stories';

const mapStateToProps = state => {
  const id = state.getIn(['stories', 'dialogs', 'remove']);

  return {
    open: id !== -1,
    id,
  };
};

const mapDispatchToProps = dispatch => ({
  cancel() {
    dispatch(closeRemoveModal());
  },
  removeStory(id) {
    dispatch(remove(id));
  },
});

const ConfirmRemoveStory = connect(
  mapStateToProps,
  mapDispatchToProps
)(RemoveStoryDialog);

export default ConfirmRemoveStory;

