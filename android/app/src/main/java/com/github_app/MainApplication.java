package com.github_app;

import android.app.*;

import com.facebook.react.*;
import com.facebook.react.shell.*;
import com.facebook.soloader.*;
import com.oblador.vectoricons.*;
import com.swmansion.gesturehandler.react.*;
import com.swmansion.reanimated.*;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.microsoft.codepush.react.CodePush;

import cl.json.RNSharePackage;
import cl.json.ShareApplication;

import org.devio.rn.splashscreen.SplashScreenReactPackage;

import java.util.*;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new RNSharePackage(),
                    new AsyncStoragePackage(),
                    new CodePush(BuildConfig.CODE_PUSH_KEY, getApplicationContext(), BuildConfig.DEBUG),
                    new ReanimatedPackage(),
                    new VectorIconsPackage(),
                    new RNGestureHandlerPackage(),
                    new SplashScreenReactPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
