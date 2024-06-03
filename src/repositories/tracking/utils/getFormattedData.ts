export async function getFormattedData(keys, data) {
    const statsByActions = {};

    for (let i = 0; i < keys.length; i++) {
        const [ad, action, userid, host] = keys[i].split(':');

        if (!statsByActions[ad]) {
            statsByActions[ad] = {};
        }

        if (!statsByActions[ad][action]) {
            statsByActions[ad][action] = 0;
        }
        statsByActions[ad][action] = String(Number(statsByActions[ad][action]) + Number(data[i]));
    }

    return statsByActions;
}