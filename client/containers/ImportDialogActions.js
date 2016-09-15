import { connect } from 'react-redux';
import ImportDialog from '../components/ImportDialog';
import { closeImportDialog } from '../reducers/config';
import { manipulate } from '../reducers/stories';

const mapStateToProps = state => ({
  open: state.getIn(['config', 'dialogs', 'import']),
});

const mapDispatchToProps = dispatch => ({
  addStory(description) {
    dispatch(manipulate({
      description,
      id: -1,
      position: 999999,
    }));
  },
  close() {
    dispatch(closeImportDialog());
  },
});

const ImportDialogActions = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportDialog);

export default ImportDialogActions;

