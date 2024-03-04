class Dataslate {
    constructor(
        name = "",
        player = "",
        faction = "",
        keywords = [],
        base = "",
        assets = [],
        quirks = [],
        {
            requisitionPoints = 0,
            assetCapacity = 0,
            specOpsLog = [],
            stash = [],
            strategicAssets = [],
            notes = [],
            datacards = [],
        } = {},
    ) {
        this.name = typeof name === 'string' ? name : "";
        this.player = typeof player === 'string' ? player : "";
        this.faction = typeof faction === 'string' ? faction : "";
        this.keywords = Array.isArray(keywords) ? keywords.filter(x => typeof x === 'string') : [];
        this.base = typeof base === 'string' ? base : "";
        this.assets = Array.isArray(assets) ? assets.filter(x => x instanceof Assets) : [];
        this.quirks = Array.isArray(quirks) ? quirks.filter(x => typeof x === 'string') : [];
        requisitionPoints = parseInt(requisitionPoints);
        assetCapacity = parseInt(assetCapacity);
        this.requisitionPoints = isFinitePositive(requisitionPoints) ? requisitionPoints : 0;
        this.assetCapacity = isFinitePositive(assetCapacity) ? assetCapacity : 0;
        this.specOpsLog = Array.isArray(specOpsLog) ? specOpsLog.filter(x => x instanceof SpecOp) : [];
        this.stash = Array.isArray(stash) ? stash.filter(x => x instanceof Equipment) : [];
        this.strategicAssets = Array.isArray(strategicAssets) ? strategicAssets.filter(x => typeof x === 'string') : [];
        this.notes = Array.isArray(notes) ? notes.filter(x => typeof x === 'string') : [];
        this.datacards = Array.isArray(datacards) ? datacards.filter(x => x instanceof Datacard) : [];
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new Dataslate(
            object.name,
            object.player,
            object.faction,
            object.keywords,
            object.base,
            object.assets,//object.assets?.map(x => Assets.parse(x)),
            object.quirks,
            {
                requisitionPoints: object.requisitionPoints,
                assetCapacity: object.assetCapacity,
                specOpsLog: object.specOpsLog,//specOpsLog: object.specOpsLog?.map(x => SpecOp.parse(x)),
                stash: object.stash?.map(x => Equipment.parse(x)),
                strategicAssets: object.strategicAssets,
                notes: object.notes,
                datacards: object.datacards?.map(x => Datacard.parse(x)),
            },
        );
    }

}