import { Component } from "@angular/core";
import "./bundle-config";
import * as application from 'application';

import { BackgroundFetch } from "nativescript-background-fetch";
import { Observable } from "tns-core-modules/data/observable";
import { LocalNotifications } from "nativescript-local-notifications";
declare var TSBackgroundFetch: any;


@Component({
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent extends Observable {

    constructor() {
        BackgroundFetch.configure({
            enableHeadless: true,
            minimumFetchInterval: "1",  // minutes
            forceReload: true,
            stopOnTerminate: false,    // Android-only
            startOnBoot: true          // Android-only
        }, () => {
            var nd = new Date((new Date().getTime() + (new Date().getTimezoneOffset() * 60000)) + (3600000 * 5.5));
            console.log("[js] BackgroundFetch event received: " + nd.toLocaleString() + "Count :" + count);
            count = count + 1;
            // BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
        }, (status) => {
            console.log('BackgroundFetch not supported by your OS', status);
        });
        super();
        var count = 0;
        if (application.ios) {
            class MyDelegate extends UIResponder {
                public static ObjCProtocols = [UIApplicationDelegate];

                // public applicationPerformFetchWithCompletionHandler(application: UIApplication, completionHandler: any) {
                //     console.log('- AppDelegate Rx Fetch event');
                //     BackgroundFetch.performFetchWithCompletionHandler(completionHandler, application.applicationState);
                // }
            }
            application.ios.delegate = MyDelegate;
        } else if (application.android) {
            BackgroundFetch.start(() => {
                this.doScheduleEveryMinute();
                console.log("BackgroundFetch successfully started");
            }, (status) => {
                console.log("BackgroundFetch failed to start: ", status);
            });
        }

        // Configure Background Fetch

    }
    public arr: any[];
    public doScheduleEveryMinute(): void {
        LocalNotifications.schedule(
            [{
                id: 9,
                title: 'Every minute!',
                interval: 'second', // some constant
                body: 'I\'m repeating until cancelled',
                icon: 'res://ic_stat_smiley',
                thumbnail: "res://ic_stat_notify",
                forceShowWhenInForeground: true,
                at: new Date(new Date().getTime() + 1 * 1000)
            }, {
                id: 10,
                title: 'Every minute!',
                interval: 'second', // some constant
                body: 'I\'m repeating until cancelled',
                icon: 'res://ic_stat_smiley',
                thumbnail: "res://ic_stat_notify",
                forceShowWhenInForeground: true,
                at: new Date(new Date().getTime() + 1 * 1000)
            }])
            .then(() => {
                alert({
                    title: "Notification scheduled",
                    message: 'ID: 6, repeating',
                    okButtonText: "OK, thanks"
                });
            })
            .catch(error => console.log("doScheduleEveryMinute error: " + error));

    }

}
