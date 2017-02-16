export const HOVER_DUPE = "HOVER_DUPE";
export const CHANGE_DEPTH = "CHANGE_DEPTH";
export const OPEN_CHUNK = "OPEN_CHUNK";
export const BACK_TO_TOP = "BACK_TO_TOP";
export const ZOOM_ON_NODE = "ZOOM_ON_NODE";
export const RECIEVED_STATS = "RECIEVED_STATS";


export const hoverDupe = dupeName => {
    return {
        type: HOVER_DUPE,
        data: dupeName
    }
}

export const changeDepth = (depth) => {
    return {
        type: CHANGE_DEPTH,
        data: depth
    }
}

export const openChunk = (open) => {
    return {
        type: OPEN_CHUNK,
        data: open
    };
};

export const backToTop = () => {
    return {
        type: BACK_TO_TOP
    };
};

export const zoomOnNode = (node) => {
    return {
        type: ZOOM_ON_NODE,
        data: node
    }
};

export const recievedStats = (statsJson) => {
    return {
        type: RECIEVED_STATS,
        data: statsJson
    }
};
