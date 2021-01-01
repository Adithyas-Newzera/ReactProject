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
import {
  ApolloClient,
  InMemoryCache,
  useMutation,
  gql,
  useQuery,
  ApolloProvider,
} from '@apollo/client';

const Stack = createStackNavigator();

const Client = new ApolloClient({
  uri: 'http://<ENTER-IP-ADDRESS>:4000',
  cache: new InMemoryCache(),
});
const CHANGE_DP = gql`
  mutation changeProfilePic($uid: String!, $dp: String!) {
    changeDP(userID: $uid, dpRoute: $dp) {
      dpRoute
    }
  }
`;
const GET_ALL_DETAILS = gql`
  query getUserQuery($uid: String!) {
    getUserByID(userID: $uid) {
      userName
      userLocation
      dpRoute
    }
  }
`;
function launchCamera() {
  let options = {
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  return new Promise(function (resolve, reject) {
    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        return reject('cancelled');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        return reject(response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        return resolve(response.uri);
      }
    });
  });
}
function launchImageLibrary() {
  let options = {
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  return new Promise(function (resolve, reject) {
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        return reject('cancelled');
      } else if (response.error) {
        console.log('ImagePicker Error: ');
        return reject(response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ');
        // alert(response.customButton);
        return reject('custom Button');
      } else {
        return resolve(response.uri);
      }
    });
  });
}
function storyBorder(props) {
  let BorderColor = '';
  if (props.storySeenStatus) {
    BorderColor = 'grey';
  } else {
    BorderColor = 'orange';
  }
  return {
    borderColor: BorderColor,
  };
}
function HomeScreen(props) {
  let fileUri = '';
  const [storySeen, changeStorySeen] = useState(false);
  const [userID, changeUserID] = useState('1');
  const {loading, error, data, fetchMore} = useQuery(GET_ALL_DETAILS, {
    variables: {uid: userID},
    client: Client,
  });
  const [changeDP, {loading2, error2}] = useMutation(CHANGE_DP);
  if (loading2) {
    return <Text>Mutation Loading..</Text>;
  }
  if (error2) {
    return <Text>Mutation Error</Text>;
  }
  if (loading) {
    return <Text>Loading... Fetching Query</Text>;
  }
  if (error) {
    return <Text>Error psst `${error.message}`</Text>;
  }
  if (data) {
    if (data.getUserByID.dpRoute != fileUri) {
      fileUri = data.getUserByID.dpRoute;
    }
    return (
      <SafeAreaView>
        <ScrollView>
          <View>
            <View style={styles.container}>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('Details'), changeStorySeen(true);
                }}>
                <View
                  style={[
                    styles.border,
                    storyBorder({
                      storySeenStatus: storySeen,
                    }),
                  ]}>
                  {fileUri != '' && fileUri != null ? (
                    <Image source={{uri: fileUri}} style={styles.img} />
                  ) : (
                    <Image
                      source={require('./images/default.png')}
                      style={styles.img}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.nameArea}>
              <Text style={{fontSize: 30}}>{data.getUserByID.userName}</Text>
              <Text style={{fontSize: 22}}>
                {data.getUserByID.userLocation}
              </Text>
            </View>
            <View style={{margin: 5, marginTop: 50}}>
              <TouchableOpacity
                onPress={() => {
                  changeUserID('1');
                  changeStorySeen(false);
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 20,
                    backgroundColor: 'blue',
                  }}>
                  Set userID = 1
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{margin: 5}}>
              <TouchableOpacity
                onPress={() => {
                  changeUserID('2');
                  changeStorySeen(false);
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 20,
                    backgroundColor: 'blue',
                  }}>
                  Set userID = 2
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{margin: 5}}>
              <TouchableOpacity
                onPress={() => {
                  changeUserID('3');
                  changeStorySeen(false);
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 20,
                    backgroundColor: 'blue',
                  }}>
                  Set userID = 3
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{margin: 5}}>
              <TouchableOpacity
                onPress={async () => {
                  let x = await launchImageLibrary();
                  changeDP({
                    variables: {uid: userID, dp: x},
                    client: Client,
                  }).then(console.log('Img inserted in DB, ', x));
                  if (x != fileUri) {
                    fileUri = x;
                    fetchMore({uid: userID});
                  }
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 20,
                    backgroundColor: 'blue',
                  }}>
                  Choose DP from Gallery
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{margin: 5}}>
              <TouchableOpacity
                onPress={async () => {
                  let y = await launchCamera();
                  changeDP({
                    variables: {uid: userID, dp: y},
                    client: Client,
                  }).then(console.log('Img inserted in DB, ', y));
                  if (y != fileUri) {
                    fileUri = y;
                    fetchMore({uid: userID});
                  }
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 20,
                    backgroundColor: 'blue',
                  }}>
                  Take Photo
                </Text>
              </TouchableOpacity>
            </View>
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
