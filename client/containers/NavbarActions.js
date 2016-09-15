import { connect } from 'react-redux';
import Navbar from '../components/Navbar';
import { openImportDialog } from '../reducers/config';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  openImportDialog() {
    dispatch(openImportDialog());
  },
});

const NavbarActions = connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);

export default NavbarActions;

