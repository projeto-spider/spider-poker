import {connect} from 'react-redux';
import ImportDialog from '../components/ImportDialog';
import {closeImportDialog} from '../reducers/config';
import {manipulateStory} from '../reducers/stories';

const mapStateToProps = state => ({
  open: state.config.importDialogOpen
});

const mapDispatchToProps = dispatch => ({
  addStory(description) {
    dispatch(manipulateStory({
      description,
      id: -1,
      position: 999999
    }));
  },
  close() {
    dispatch(closeImportDialog());
  }
});

const ImportDialogActions = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportDialog);

export default ImportDialogActions;

