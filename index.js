import React from 'react';
import {View} from 'react-native';
import {
    StackActions,
    NavigationActions,
    StackRouter,
    createNavigator
} from 'react-navigation'; // Version can be specified in package.json
import {StackView} from 'react-navigation-stack';


class TwoPaneNavigator extends React.Component {

    LeftPaneComponent: null;
    RightPaneEmptyComponent: null;

    constructor(props) {
        super(props);

        const config = this.props.navigationConfig;
        const router = config.router;

        this.LeftPaneComponent = router.getComponentForRouteName(config.initialRouteName);
        this.RightPaneEmptyComponent = router.getComponentForRouteName(config.emptyRightPaneName);
    }


    render() {
        const {navigation, screenProps, navigationConfig, descriptors} = this.props;
        const state = navigation.state;

        let isStartScreen = state.routes[state.index].routeName == navigationConfig.initialRouteName;
        let rightPane;
        if (isStartScreen) {
            rightPane = <this.RightPaneEmptyComponent navigation={navigation}/>;
        }
        else {
            rightPane = <StackView navigation={navigation}
                                   screenProps={screenProps}
                                   navigationConfig={navigationConfig}
                                   descriptors={descriptors}></StackView>
        }

        return (
            <View style={{flex: 1, flexDirection: 'row'}}>
                <View>
                    <this.LeftPaneComponent navigation={navigation}/>
                </View>
                {rightPane}
            </View>
        );
    }
};

function createTwoPaneNavigator(routeConfigMap, navigationConfig) {

    const router = StackRouter(routeConfigMap, navigationConfig);
    const configWithRouter = {...navigationConfig, router: router}

    let twoPaneNavigator = createNavigator(TwoPaneNavigator, router, configWithRouter);

    const defaultGetStateForAction = router.getStateForAction;
    router.getStateForAction = (action: any, state: any) => {
        return defaultGetStateForAction(action, state);
    };

    return twoPaneNavigator;
}

export {createTwoPaneNavigator};
