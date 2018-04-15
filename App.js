import React from 'react';
import { FlatList, ActivityIndicator, Text, View, Image, Button, StyleSheet, Alert, TouchableOpacity, Modal } from 'react-native';

export default class IGFetchTest extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      isShowMessage: false,
      errorMeassge: '',
      // account_id: 'caradelevingne',
      account_id: 'music',  // You can change the Instagram hashtag here
      sort_id : 'like',
      modalVisible : false,
      modalImageUrl : "",
    }
  }

  componentDidMount(){
    this.fetchData();
  }

  render(){

    return(
        <View style={styles.container}>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={()=>{
               { this.setState({modalVisible:false}); }
          }}
        >
          <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0, 0, 0, 0.5)'}}>
            <View style={styles.modal}>
                <Image
                    style={styles.modalImage}
                    source={{uri: this.state.modalImageUrl}}
                />

                <View style={{position:'absolute', right:2, top:2}}>
                  <TouchableOpacity activeOpacity={0.7} onPress={()=>{this.setState({modalVisible:false})}}>
                  <Image
                      style={styles.modalCloseButton}
                      source={require('./src/close.png')}
                  />
                  </TouchableOpacity>
                </View>
            </View>

          </View>
        </Modal>

        {this.makeViewButtons()}

        {this.makeViewLoading()}

        {this.makeViewErrorMessage()}

        <View style={{flex: 10,paddingTop:2}}>
          <FlatList
            data={this.state.dataSource}
            renderItem={({item}) =>
              <View style={{flex:1, alignItems:'center', paddingBottom:5}}>
                <TouchableOpacity activeOpacity={0.7} onPress={this.setModalVisible.bind(this, this.state.modalVisible, item.node.display_url)}>
                  <Image
                    style={styles.image}
                    source={{uri: item.node.thumbnail_src}}
                  />
                </TouchableOpacity>

                <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                  <Image
                    style={styles.imageIcon}
                    source={require('./src/like.png')}
                  />
                  <Text>{convertCount(item.node.edge_liked_by.count)}   </Text>
                  <Image
                    style={styles.imageIcon}
                    source={require('./src/comment.png')}
                  />
                  <Text>{convertCount(item.node.edge_media_to_comment.count)}</Text>
                </View>
              </View>
            }
            keyExtractor={(item, index) => index}
            numColumns={3}
          />
        </View>
      </View>
    );
  }

  // My methods

  makeViewButtons(){
    return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.textButton} activeOpacity={0.7} onPress={this.changeSortLike.bind(this)}>
            <Text style={styles.textButtonText}>Sort by Like</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.textButton} activeOpacity={0.7} onPress={this.changeSortComment.bind(this)}>
            <Text style={styles.textButtonText}>Sort by Comment</Text>
          </TouchableOpacity>
        </View>
      );
  }

  makeViewLoading(){
    if(this.state.isLoading){
      return (
          <View>
            <View style={{justifyContent:'center', margin:10}}>
              <View>
                <ActivityIndicator size="large" />
              </View>
            </View>
          </View>
       );
    }
  }

  makeViewErrorMessage(){
        //if((!this.state.isLoading) && this.state.isShowMessage){
    if(this.state.isShowMessage){
      return (
          <View style={{justifyContent:'center', alignItems:'center', paddingTop:30}}>
            <Text>Sorry, failed to access server!</Text>
            <Text>Error: {this.state.errorMeassge}</Text>
          </View>
       );
    }
  }

  setModalVisible(isVisible, url) {
    this.setState({modalVisible: !isVisible, modalImageUrl: url});
  }

  clickImage(msg) {
    Alert.alert(msg);
  }

  changeSortLike(){
      this.state.sort_id='like';
      this.fetchData();
      this.setState({isLoading: true,isShowMessage: false});
  }
  changeSortComment(){
      this.state.sort_id='comment';
      this.fetchData();
      this.setState({isLoading: true,isShowMessage: false});
  }

  fetchData(){
    var my_url = 'http://test.chungkan.com/react_test_tag_v2.php?id='+this.state.account_id+'&sort='+this.state.sort_id;

    fetch(my_url, {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json'
           }
       })
      .then(response => {
        if (response.status === 200) {
          hasError = false;
          return response.json();
        } else {
          hasError = true;
          return response.text();
        }
      })
      .then(responseJson => {
        if (hasError) {
          this.setState({
              isLoading: false,
              isShowMessage: true,
              errorMeassge: 'Network problem',
          });
        } else {
          if (responseJson.success) {
            this.setState({
                isLoading: false,
                isShowMessage: false,
                dataSource: responseJson.data,
              }, function(){
                // In this block you can do something with new state.
              });
          } else {
            this.setState({
              isLoading: false,
              isShowMessage: true,
              errorMeassge: responseJson.error,
            });
          }
        }
      })
      .catch((error) =>{
        // console.error(error);
        this.setState({
          isLoading: false,
          isShowMessage: true,
          errorMeassge: 'Network problem',
        });
      })
      ;
  }
}

// get real size of device screen
var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;
var imageWidth = Math.floor(screenWidth/3.3);
var imageIconWidth = Math.floor(screenWidth/25);
var modalWidth, modalCloseButtonSize, screenSizeStandard, buttonWidth;
screenSizeStandard = (screenWidth<screenHeight) ? screenWidth : screenHeight ;
modalWidth = Math.floor(screenSizeStandard*0.95);
// modalImageWidth = Math.floor(modalWidth*0.96);
modalCloseButtonSize = Math.floor(screenSizeStandard*0.1);
buttonWidth = Math.floor(screenSizeStandard/2.2);

// convert number into K,M,B format (2300 => 2K)
function convertCount(x) {
  var b;
  if (x>=1000000000) {
    b = Math.floor(x/1000000000);
    return b+'B';
  }
  if (x>=1000000) {
    b = Math.floor(x/1000000);
    return b+'M';
  }
  if (x>=1000) {
    b = Math.floor(x/1000);
    return b+'K';
  }
  return x;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // justifyContent: 'space-between',
    margin: 6,
  },
  button: {
    flex:1,
    alignSelf: 'stretch',
  },
  textButton: {
    width: buttonWidth,
    alignItems:'center',
    backgroundColor: 'blue',
    borderRadius: 5,
    padding:5,
  },
  textButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  image:{
    width: imageWidth,
    height: imageWidth,
    borderRadius: 6,
  },
  imageIcon:{
    width: imageIconWidth,
    height: imageIconWidth,
  },
  modal:{
    width: modalWidth,
    height: modalWidth,
    backgroundColor:'transparent',
  },
  modalImage:{
    width: modalWidth,
    height: modalWidth,
    justifyContent:'center',
    alignItems:'center',
    borderRadius: 12,
    borderWidth:4,
    borderColor:'white'
  },
  modalCloseButton:{
    width: modalCloseButtonSize,
    height: modalCloseButtonSize,
  },
})