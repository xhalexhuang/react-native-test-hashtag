# react-native-test-hashtag

Testing project for React Native

## Features
* Fetch posts from an Instagram by hashtag 'music'
* Backend data processing by PHP
* Display posts in React Native project
* Can sort by like-count or comment-count
* Can show large size picture on modal window
* Can handle networking error

![](https://github.com/xhalexhuang/react-native-test-2018/raw/master/picture/picture03.jpg)

![](https://github.com/xhalexhuang/react-native-test-2018/raw/master/picture/picture04.jpg)

![](https://github.com/xhalexhuang/react-native-test-2018/raw/master/picture/picture05.jpg)

![](https://github.com/xhalexhuang/react-native-test-2018/raw/master/picture/picture06.jpg)

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
...
```
