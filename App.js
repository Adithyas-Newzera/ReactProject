import React, {useState, useRef, useEffect, Fragment, Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Button,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {
  ApolloClient,
  InMemoryCache,
  useMutation,
  gql,
  useQuery,
  ApolloProvider,
} from '@apollo/client';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
  MenuContext,
} from 'react-native-popup-menu';
import ImagePicker from 'react-native-image-picker';
import styles from './styles';
import DetailsScreen from './StoryScreen';
const story = {
  uri:
    'https://images.thequint.com/thequint/2020-12/e5c00150-5b50-46b2-80a4-e892ddbe351b/Epkwv0UWMAICMGq.jpg',
};
const Stack = createStackNavigator();

const Client = new ApolloClient({
  uri: 'http://<Enter-IP-Address-Here>:4000',
  cache: new InMemoryCache(),
});
const GET_USER_DETAILS = gql`
  query getUserQuery($uid: String!) {
    getUserByID(userID: $uid) {
      userName
      userLocation
    }
  }
`;
const GET_USER_DP = gql`
  query getUserQuery($uid: String!) {
    getUserByID(userID: $uid) {
      dpRoute
    }
  }
`;
const CHANGE_DP = gql`
  mutation changeProfilePic($uid: String!, $dp: String!) {
    changeDP(userID: $uid, dpRoute: $dp) {
      dpRoute
    }
  }
`;
const RetrieveUserDetails = (props) => {
  const {loading, error, data} = useQuery(GET_USER_DETAILS, {
    variables: {uid: props.userNumber},
  });
  console.log('UserNumber is ', props.userNumber);
  if (loading) {
    console.log('loading');
    return <Text>Loading...</Text>;
  }
  if (error) {
    console.log('error');
    return <Text>`Error! ${error.message}`</Text>;
  }
  if (data) {
    console.log('Data found: ', data);
    console.log(
      'Data found:',
      data.getUserByID.userName,
      data.getUserByID.userLocation,
    );
    return (
      <View style={styles.nameArea}>
        <Text style={{fontSize: 30}}>{data.getUserByID.userName}</Text>
        <Text style={{fontSize: 22}}>{data.getUserByID.userLocation}</Text>
      </View>
    );
  }
};
class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileData: '',
      fileUri: '',
      storyAdded: false,
      storySeen: false,
      userNumber: '1',
    };
  }
  launchCamera = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = {uri: response.uri};
        console.log('response', JSON.stringify(response));
        this.setState({
          fileData: response.data,
          fileUri: response.uri,
        });
      }
    });
  };
  launchImageLibrary = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = {uri: response.uri};
        console.log('response', JSON.stringify(response));
        this.setState({
          fileData: response.data,
          fileUri: response.uri,
        });
      }
    });
  };
  renderFileUri() {
    console.log('The image route is: ', this.state.fileUri);
    if (this.state.fileUri) {
      return <Image source={{uri: this.state.fileUri}} style={styles.img} />;
    } else {
      return (
        <Image source={require('./images/default.png')} style={styles.img} />
      );
    }
  }
  deleteProfilePicture = () => {
    this.setState({
      filepath: {
        data: '',
        uri: '',
      },
      fileData: '',
      fileUri: '',
    });
  };
  render() {
    function storyBorder(props) {
      let BorderColor = '';
      if (props.storySeenStatus && props.storyAddedStatus) {
        BorderColor = 'grey';
      } else if (!props.storySeenStatus && props.storyAddedStatus) {
        BorderColor = 'orange';
      } else {
        BorderColor = 'transparent';
      }
      return {
        borderColor: BorderColor,
      };
    }
    return (
      <SafeAreaView>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.container}>
              <MenuProvider>
                <TouchableOpacity
                  onPress={() => {
                    if (this.state.storyAdded) {
                      this.props.navigation.navigate('Details'),
                        this.setState({storySeen: true});
                    }
                  }}
                  onLongPress={() => {
                    this.menu.open();
                  }}>
                  <View
                    style={[
                      styles.border,
                      storyBorder({
                        storySeenStatus: this.state.storySeen,
                        storyAddedStatus: this.state.storyAdded,
                      }),
                    ]}>
                    {this.renderFileUri()}
                  </View>
                  <Menu
                    ref={(c) => {
                      this.menu = c;
                    }}>
                    <MenuTrigger text="" />
                    <MenuOptions>
                      <MenuOption
                        onSelect={() => {
                          this.setState({userNumber: '1'});
                        }}
                        text="Set user one"
                      />
                      <MenuOption
                        onSelect={() => {
                          this.setState({userNumber: '2'});
                        }}
                        text="Set user two"
                      />
                      <MenuOption
                        onSelect={() => {
                          this.setState({userNumber: '3'});
                        }}
                        text="Set user three"
                      />
                      <MenuOption
                        onSelect={this.launchImageLibrary}
                        text="Choose From Gallery"
                      />
                      <MenuOption
                        onSelect={this.launchCamera}
                        text="Take Picture"
                      />
                      <MenuOption
                        onSelect={this.deleteProfilePicture}
                        text="Delete Profile Picture"
                      />
                      <MenuOption
                        onSelect={() => {
                          if (this.state.storyAdded) {
                            this.setState({storyAdded: false});
                          } else {
                            this.setState({storyAdded: true});
                            this.setState({storySeen: false});
                          }
                          setTimeout(() => {
                            if (this.state.storyAdded) {
                              alert('Story Added');
                            } else {
                              alert('Story Deleted');
                            }
                          }, 500);
                        }}
                        text={
                          this.state.storyAdded ? 'Delete story' : 'Add story'
                        }
                      />
                    </MenuOptions>
                  </Menu>
                </TouchableOpacity>
              </MenuProvider>
            </View>
            <RetrieveUserDetails userNumber={this.state.userNumber} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function App() {
  return (
    <ApolloProvider client={Client}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}

export default App;
