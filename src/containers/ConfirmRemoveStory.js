import {connect} from 'react-redux';
import RemoveStoryDialog from '../components/RemoveStoryDialog';
import {closeConfirmRemoveStoryModal} from '../reducers/config';
import {removeStory} from '../reducers/stories';

const mapStateToProps = state => ({
  open: state.getIn(['config', 'confirmingRemoveStory']) !== -1,
  id: state.getIn(['config', 'confirmingRemoveStory'])
});

const mapDispatchToProps = dispatch => ({
  cancel() {
    dispatch(closeConfirmRemoveStoryModal());
  },
  removeStory(id) {
    dispatch(removeStory(id));
  }
});

const ConfirmRemoveStory = connect(
  mapStateToProps,
  mapDispatchToProps
)(RemoveStoryDialog);

export default ConfirmRemoveStory;

