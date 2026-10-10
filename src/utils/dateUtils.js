export const formatTime = (dt, now = new Date()) => {
    if(!dt) {
        return "";
    }

    const dtTime = new Date(dt)
    const diffMs = now.getTime() - dtTime.getTime();

    const diffMinutes = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    if(diffMinutes < 1) {
        return "방근 전";
    }

    if(diffMinutes < 60) {
        return `${diffMinutes}분 전`;
    }

    if(diffHours < 24) {
        return `${diffHours}시간 전`;
    }

    if(diffDays === 1) {
        return `어제 ${dtTime.toLocaleTimeString(
            "ko-KR",
            {
                hour: "2-digit", //시간을 2자리로 출력
                minute: "2-digit", //분을 2자리로 출력
                hour12: false //오전, 오후 방식이 아닌 24시간제 의미
            }
        )}`;
    }

    return dtTime.toLocaleDateString(
        "ko-KR",
        {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }
    );
};

export const formatTimeChange = (time) => {
    if(!time || time.length < 4) {
        return "";
    }

    return `${time.substring(0, 2)}:${time.substring(2, 4)}`;
}

export const formatTimeReChange = (time) => {
    if(!time || time.length < 5) {
        return "";
    }

    return `${time.substring(0, 2)}${time.substring(3, 5)}00`;
}