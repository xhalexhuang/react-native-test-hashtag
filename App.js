import React from 'react';
import { FlatList, ActivityIndicator, Text, View, Image, StyleSheet, Alert, TouchableOpacity, Modal } from 'react-native';

export default class IGFetchTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      isLoading: true,
      isShowMessage: false,
      isRefreshing: false,
      isError: false,
      errorMeassge: '',
      // account_id: 'caradelevingne',
      account_id: 'music', // You can change the Instagram hashtag here
      sort_id: 'like',
      total_count: 0,
      current_count: 0,
      showFooter: 1, // for Footer, 0: Hidden, 1: Loading,  2: No more records
      modalVisible: false,
      modalImageUrl: '',
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  setModalVisible(isVisible, url) {
    this.setState({ modalVisible: !isVisible, modalImageUrl: url });
  }

  // clickImage(msg) {
  //   Alert.alert(msg);
  // }
  scrollTop = () => {
    this.refs.listRef.scrollToOffset({ offset: 0, animated: true });
  };

  changeSortLike() {
    this.state.sort_id = 'like';
    this.state.page = 1;
    this.state.showFooter = 1;
    this.scrollTop();
    this.fetchData();
  }
  changeSortComment() {
    this.state.sort_id = 'comment';
    this.state.page = 1;
    this.state.showFooter = 1;
    this.scrollTop();
    this.fetchData();
  }

  makeModal() {
    return (
      <Modal
        animationType="slide"
        transparent
        visible={this.state.modalVisible}
        onRequestClose={() => {
          this.setState({ modalVisible: false });
        }}
      >
        <View style={{
          flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View style={styles.modal}>
            <View>
              <Image
                style={styles.modalImage}
                source={{ uri: this.state.modalImageUrl }}
              />
            </View>

            <View style={{ position: 'absolute', right: 2, top: 2 }}>
              <TouchableOpacity activeOpacity={0.7} onPress={() => { this.setState({ modalVisible: false }); }}>
                <Image
                  style={styles.modalCloseButton}
                  source={require('./src/close.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  showStatus() {
    return (
      <View>
        <TouchableOpacity activeOpacity={0.7} onPress={this.scrollTop.bind(this)}>
          <Text> Count:{this.state.current_count}/{this.state.total_count}  Page:{this.state.page}  Refresh:{this.state.isRefreshing?'1':'0'}  Load:{this.state.isLoading?'1':'0'}  Footer:{this.state.showFooter}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  showButtons() {
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

  showErrorMessage() {
    if (this.state.isShowMessage) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 20 }}>
          <Text>Sorry, failed to access server!</Text>
          <Text>Error: {this.state.errorMeassge}</Text>
        </View>
      );
    }
  }

  showFlatList() {
    return (
      <View style={{ flex: 1, paddingTop: 2 }}>
        <FlatList ref="listRef"
          data={this.state.dataSource}
          renderItem={({ item }) => (
            <View style={{ flex: 1, alignItems: 'center', paddingBottom: 5 }}>
              <TouchableOpacity activeOpacity={0.7} onPress={this.setModalVisible.bind(this, this.state.modalVisible, item.node.src_lg)}>
                <Image
                  style={styles.image}
                  source={{ uri: item.node.src_lg }}
                />
              </TouchableOpacity>

              <View style={{
                  flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                }}
              >
                <Image
                  style={styles.imageIcon}
                  source={require('./src/like.png')}
                />
                <Text>{convertCount(item.node.like)}   </Text>
                <Image
                  style={styles.imageIcon}
                  source={require('./src/comment.png')}
                />
                <Text>{convertCount(item.node.comment)}</Text>
              </View>
            </View>)
          }
          numColumns={3}
          keyExtractor={(item, index) => index}
          // keyExtractor={i => i.id}
          extraData={this.state}
          refreshing={this.state.isRefreshing}
          onRefresh={this._handleRefresh}
          onEndReached={this._handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={this._makeFooter}
        />
      </View>
    );
  }

  showGoTopButton() {
    if (this.state.isShowMessage) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 20 }}>
          <Text>Sorry, failed to access server!</Text>
          <Text>Error: {this.state.errorMeassge}</Text>
        </View>
      );
    }
  }

  _handleRefresh = () => {
    this.setState({
      isRefreshing: true,
      showFooter: 1,
    }, () => {
      this.fetchData();
    });
  };

  _handleLoadMore = () => {
    if (this.state.current_count < this.state.total_count) {
      this.setState({
        page: this.state.page + 1,
        showFooter: 1,
      }, () => {
        this.fetchData();
      });
    } else {
        this.setState({
          showFooter: 2,
        });
    }
  };

  _makeFooter = () => {
    if (this.state.showFooter === 0){
        return (
            <View></View>
        );
    } else if(this.state.showFooter === 1) {
        return (
            <View style={{ justifyContent:'center', margin:10 }}>
                <ActivityIndicator size="large" />
            </View>
        );
    } else if(this.state.showFooter === 2) {
      return (
        <View style={{alignItems:'center', justifyContent:'center', margin:20}}>
            <Text>No more records!</Text>
        </View>
      );
    }
  }

  fetchData() {
    this.setState({ isLoading: true, isShowMessage: false });
    let myUrl = `http://test.chungkan.com/react_test_tag_v5.php?page=${this.state.page}&id=${this.state.account_id}&sort=${this.state.sort_id}`;

    fetch(myUrl)
      .then((response) => {
        if (response.status === 200) {
          this.state.isError = false;
          return response.json();
        }
        this.state.isError = true;
        return response.text();
      })
      .then((responseJson) => {
        if (this.state.isError) {
          this.setState({
            isLoading: false,
            isShowMessage: true,
            showFooter: 0,
            errorMeassge: 'Network problem',
          });
        } else if (responseJson.success) {
          this.setState({
            isLoading: false,
            isShowMessage: false,
            dataSource: responseJson.data,
            total_count: responseJson.total_count,
            current_count: responseJson.current_count,
            isRefreshing: false,
          });
        } else {
          this.setState({
            isLoading: false,
            isShowMessage: true,
            showFooter: 0,
            errorMeassge: responseJson.error,
          });
        }
      })
      .catch((error) => {
        // console.error(error);
        this.setState({
          isLoading: false,
          isRefreshing: false,
          isShowMessage: true,
          showFooter: 0,
          errorMeassge: 'Network problem',
        });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.makeModal()}
        {this.showStatus()}
        {this.showButtons()}
        {this.showErrorMessage()}
        {this.showFlatList()}
        {this.showGoTopButton()}
      </View>
    );
  }

}

// get real size of device screen
let Dimensions = require('Dimensions');

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
let imageWidth = Math.floor(screenWidth / 3.3);
let imageIconWidth = Math.floor(screenWidth / 25);
let modalWidth;
let modalCloseButtonSize;
let screenSizeStandard;
let buttonWidth;
screenSizeStandard = (screenWidth < screenHeight) ? screenWidth : screenHeight;
modalWidth = Math.floor(screenSizeStandard * 0.95);
// modalImageWidth = Math.floor(modalWidth*0.96);
modalCloseButtonSize = Math.floor(screenSizeStandard * 0.1);
buttonWidth = Math.floor(screenSizeStandard / 2.2);

// convert number into K,M,B format (2300 => 2K)
function convertCount(x) {
  let b;
  if (x >= 1000000000) {
    b = Math.floor(x / 1000000000);
    return `${b}B`;
  }
  if (x >= 1000000) {
    b = Math.floor(x / 1000000);
    return `${b}M`;
  }
  if (x >= 1000) {
    b = Math.floor(x / 1000);
    return `${b}K`;
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
    flex: 1,
    alignSelf: 'stretch',
  },
  textButton: {
    width: buttonWidth,
    alignItems: 'center',
    backgroundColor: 'blue',
    borderRadius: 5,
    padding: 5,
  },
  textButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  image: {
    width: imageWidth,
    height: imageWidth,
    borderRadius: 6,
  },
  imageIcon: {
    width: imageIconWidth,
    height: imageIconWidth,
  },
  modal: {
    width: modalWidth,
    height: modalWidth,
    backgroundColor: 'transparent',
  },
  modalImage: {
    width: modalWidth,
    height: modalWidth,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 4,
    borderColor: 'white',
  },
  modalCloseButton: {
    width: modalCloseButtonSize,
    height: modalCloseButtonSize,
  },
});
