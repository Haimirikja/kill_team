class Dataslate {
    constructor(
        killTeam = "",
        name = "",
        {
            requisitionPoints = 4,
            assetCapacity = 2,
            specOpsLog = [],
            stash = [],
            strategicAssets = [],
            datacards = [],
        } = {},
    ) {
        this.killTeam = typeof killTeam === 'string' ? killTeam : "";
        this.name = typeof name === 'string' ? name : "";
        requisitionPoints = parseInt(requisitionPoints);
        assetCapacity = parseInt(assetCapacity);
        this.requisitionPoints = isFinitePositive(requisitionPoints) ? requisitionPoints : 4;
        this.assetCapacity = isFinitePositive(assetCapacity) ? assetCapacity : 2;
        this.specOpsLog = Array.isArray(specOpsLog) ? specOpsLog.filter(x => typeof x === 'string') : [];//specOpsLog.filter(x => x instanceof SpecOp) : [];
        this.stash = Array.isArray(stash) ? stash.filter(x => x instanceof Equipment) : [];
        this.strategicAssets = Array.isArray(strategicAssets) ? strategicAssets.filter(x => x instanceof Asset) : [];
        this.datacards = Array.isArray(datacards) ? datacards.filter(x => x instanceof Datacard) : [];
    }

    static parse = (object) => {
        if (!(object instanceof Object)) return undefined;
        return new Dataslate(
            object.killTeam,
            object.name,
            {
                requisitionPoints: object.requisitionPoints,
                assetCapacity: object.assetCapacity,
                specOpsLog: object.specOpsLog,//specOpsLog: object.specOpsLog?.map(x => SpecOp.parse(x)),
                stash: object.stash?.map(x => Equipment.parse(x)),
                strategicAssets: object.strategicAssets?.map(x => Asset.parse(x)),
                datacards: object.datacards?.map(x => Datacard.parse(x)),
            },
        );
    }

}