
package com.facebook.react;

import android.app.Application;
import android.content.Context;
import android.content.res.Resources;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.ArrayList;

// @react-native-community/geolocation
import com.reactnativecommunity.geolocation.GeolocationPackage;
// @react-native-community/netinfo
import com.reactnativecommunity.netinfo.NetInfoPackage;
// amazon-cognito-identity-js
import com.amazonaws.RNAWSCognitoPackage;
// react-native-background-job
import com.pilloxa.backgroundjob.BackgroundJobPackage;
// react-native-camera-kit
import com.wix.RNCameraKit.RNCameraKitPackage;
// react-native-device-info
import com.learnium.RNDeviceInfo.RNDeviceInfo;
// react-native-image-picker
import com.imagepicker.ImagePickerPackage;
// react-native-prompt-android
import im.shimo.react.prompt.RNPromptPackage;
// react-native-signature-capture
import com.rssignaturecapture.RSSignatureCapturePackage;
// react-native-svg
import com.horcrux.svg.SvgPackage;
// react-native-vector-icons
import com.oblador.vectoricons.VectorIconsPackage;
// react-native-version-number
import com.apsl.versionnumber.RNVersionNumberPackage;
// realm
import io.realm.react.RealmReactPackage;

public class PackageList {
  private Application application;
  private ReactNativeHost reactNativeHost;
  private MainPackageConfig mConfig;

  public PackageList(ReactNativeHost reactNativeHost) {
    this(reactNativeHost, null);
  }

  public PackageList(Application application) {
    this(application, null);
  }

  public PackageList(ReactNativeHost reactNativeHost, MainPackageConfig config) {
    this.reactNativeHost = reactNativeHost;
    mConfig = config;
  }

  public PackageList(Application application, MainPackageConfig config) {
    this.reactNativeHost = null;
    this.application = application;
    mConfig = config;
  }

  private ReactNativeHost getReactNativeHost() {
    return this.reactNativeHost;
  }

  private Resources getResources() {
    return this.getApplication().getResources();
  }

  private Application getApplication() {
    if (this.reactNativeHost == null) return this.application;
    return this.reactNativeHost.getApplication();
  }

  private Context getApplicationContext() {
    return this.getApplication().getApplicationContext();
  }

  public ArrayList<ReactPackage> getPackages() {
    return new ArrayList<>(Arrays.<ReactPackage>asList(
      new MainReactPackage(mConfig),
      new GeolocationPackage(),
      new NetInfoPackage(),
      new RNAWSCognitoPackage(),
      new BackgroundJobPackage(),
      new RNCameraKitPackage(),
      new RNDeviceInfo(),
      new ImagePickerPackage(),
      new RNPromptPackage(),
      new RSSignatureCapturePackage(),
      new SvgPackage(),
      new VectorIconsPackage(),
      new RNVersionNumberPackage(),
      new RealmReactPackage()
    ));
  }
}
