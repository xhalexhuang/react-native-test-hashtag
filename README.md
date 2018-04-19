# react-native-test-hashtag

Testing project for React Native

## Features
* Fetch posts from Instagram by hashtag 'music'
* Backend data processing by PHP
* Display posts in React Native project
* Can sort by like-count or comment-count
* Can show large size picture on modal window
* Can handle networking error
* Can pull down to refresh
* Can pull up to load more records

![](https://github.com/xhalexhuang/react-native-test-hashtag/raw/master/picture/picture07.jpg)

![](https://github.com/xhalexhuang/react-native-test-hashtag/raw/master/picture/picture08.jpg)

![](https://github.com/xhalexhuang/react-native-test-hashtag/raw/master/picture/picture09.jpg)

![](https://github.com/xhalexhuang/react-native-test-hashtag/raw/master/picture/picture10.jpg)

![](https://github.com/xhalexhuang/react-native-test-hashtag/raw/master/picture/picture11.jpg)

## Remarks
#### Initialize Project (for example, create project 'mytest' on c:\rn)
```
cd c:\rn
react-native init mytest
```

#### Copy files
* Copy folder 'src' with files inside into folder 'mytest'
*	Copy file 'App.js' into folder 'mytest' (overwrite old file 'App.js')

#### Run project
```
cd c:\rn\mytest
react-native run-android
```
#### To change Instagram account ID on App.js
```javascript
...
constructor(props){
  super(props);
  this.state = {
      page: 1,
      isLoading: true,
      isShowMessage: false,
      isRefreshing: false,
      isError: false,
      errorMeassge: '',
      account_id: 'music', // You can change the Instagram hashtag here
      sort_id: 'like',
      total_count: 0,
      current_count: 0,
      showFooter: 1, // for Footer, 0: Hidden, 1: Loading,  2: No more records
      modalVisible: false,
      modalImageUrl: '',
  }
}
...
```
