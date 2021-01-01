import {Dimensions, StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  img: {
    paddingHorizontal: 40,
    borderWidth: 6,
    alignItems: 'center',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  countContainer: {
    alignItems: 'center',
    padding: 10,
  },
  nameArea: {
    marginTop: 25,
    alignItems: 'center',
  },
  story: {
    width: '100%',
    height: 300,
    marginTop: 10,
  },
  border: {
    width: 220,
    height: 220,
    borderRadius: 110,
    padding: 5,
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarContainer: {
    height: 100,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c405a',
  },
  progressBar: {
    flexDirection: 'row',
    height: 3,
    width: '90%',
    backgroundColor: 'darkgrey',
    borderColor: '#000',
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },

  body: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    height: Dimensions.get('screen').height - 20,
    width: Dimensions.get('screen').width,
  },
  ImageSections: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  images: {
    width: 150,
    height: 150,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 3,
  },
  btnParentSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  btnSection: {
    width: 225,
    height: 50,
    backgroundColor: '#DCDCDC',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginBottom: 10,
  },
  btnText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default styles;
