import { combineReducers } from 'redux';
import { Map, List } from 'immutable';
import { mapToTree, reMap } from '../utils/heirarchify';
import {
    OPEN_CHUNK,
    HOVER_DUPE,
    CHANGE_DEPTH,
    RECIEVED_STATS,
    BACK_TO_TOP,
    ZOOM_ON_NODE
} from '../actions';


const stats = (state = Map({
    chunks: List(),
    mapSize: [900, 600],
    padding: 3,
    paddingTop: 25,
    dupeName: '',
    selectedDepth: 0,
    open: 0,
    zoomed: false
}), action) => {
    switch (action.type) {
        case OPEN_CHUNK:
            const treeHeight = state.getIn(['chunks', action.data]).tree.height;
            const fullHeight = state.getIn(['chunks', action.data]).fullTree.height;
            state = state.set('zoomed', treeHeight < fullHeight);
            state = state.set('selectedDepth', treeHeight);
            return state.set('open', action.data);
        case HOVER_DUPE:
            return state.set('dupeName', action.data);
        case CHANGE_DEPTH:
            const paddingTop = action.data < state.getIn(['chunks', state.get('open')]).fullTree.height ? state.get('paddingTop') : state.get('padding');
            state = state.set('selectedDepth', action.data);
            return state.updateIn(['chunks', state.get('open')], a => {
                a.vis = reMap(a.tree, state.get('mapSize'), state.get('padding'), paddingTop).filter(b => b.depth < action.data);
                return a;
            });
        case RECIEVED_STATS:
            state = state.set('zoomed', false);
            state = state.set('chunks', List(mapToTree(action.data, state.get('mapSize'), state.get('padding'))));
            return state.set('selectedDepth', state.get('chunks').maxBy(item => item.fullTree.height).fullTree.height);
        case BACK_TO_TOP:
            state = state.set('zoomed', false);
            state = state.set('selectedDepth', state.getIn(['chunks', state.get('open')]).fullTree.height);
            return state.updateIn(['chunks', state.get('open')], a => {
                return Object.assign({}, a, {
                    tree: a.fullTree,
                    vis: a.fullVis,
                    height: a.fullTree.height
                });
            });
        case ZOOM_ON_NODE:
            state = state.set('selectedDepth', action.data.height);
            state = state.set('zoomed', true);
            return state.updateIn(['chunks', state.get('open')], a => {
                return Object.assign({}, a, {
                    height: action.data.height,
                    vis: reMap(action.data, state.get('mapSize'), state.get('padding'), state.get('paddingTop')),
                    tree: action.data
                });
            });
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    stats
});

export default rootReducer;
