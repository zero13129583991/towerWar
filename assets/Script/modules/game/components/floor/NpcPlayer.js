var AstarMap = require("AstarMap");
var FloorLayer = require("FloorLayer");
var NpcPlayer = cc.Class({
    extends: cc.Component,

    properties: {
        level:  1,          //等级
        moveTime: {        //移动时间
            default: 0.2,
            type: cc.Float
        },
        aStarMap: AstarMap,
        floorLayer: cc.Node
    },

    start () {
        this.initTouchEvent(); //点击事件
        this.autoWalk();
    },

    //初始化点击事件
    initTouchEvent: function() {
        var self = this;
        self.node.on(cc.Node.EventType.TOUCH_START, function (event) {

        }, self.node);
        self.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {

        }, self.node);
        self.node.on(cc.Node.EventType.TOUCH_END, function (event) {

        }, self.node);
        self.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {

        }, self.node);
    },

    initNpcPlayer: function (args, floorNode) {
        this.aStarMap = floorNode.getComponent("AstarMap");
        this.floorLayer = floorNode.getComponent("FloorLayer");

        //npc位置
        var npcPosition = this.aStarMap.getCenterByTilePos(cc.v2(args.x, args.y));
        this.node.setPosition(npcPosition);
    },

    //自由移动
    autoWalk: function () {
        var self = this;
        var tileX = Math.floor(Math.random()*this.aStarMap.horTiles);
        var tileY = Math.floor(Math.random()*this.aStarMap.verTiles);
        this.moveToTile(cc.v2(tileX, tileY), function () {
            setTimeout(function () {
                self.autoWalk();
            }, 1000);
        })
    },

    //移动到瓦片
    moveToTile: function(finish, moveCb) {
        let self = this;
        self.node.stopAllActions();
        let start = self.aStarMap.getTilePosByPosition(self.node.position);
        let movePathTiles = self.aStarMap.getMovePathTiles(start, finish);

        //无路可走
        if (movePathTiles.length <= 1) {
            cc.log('cannot find path');
            console.log(start);
            if(moveCb) moveCb();
            return;
        }

        let i=-1;
        let tileSize = self.aStarMap.getTileSize();
        let tileHalfWidth = tileSize.width / 2;
        let tileHalfHeight = tileSize.height / 2;
        let moveAction = function () {
            i = i + 1;
            let curTile = movePathTiles[i];
            if(curTile && curTile.isCanCross()){
                let curTilePosition = self.aStarMap.getCenterByTilePos(curTile.position);
                if(curTile.getPeople().length > 0){
                    let addX = Math.floor(Math.random()*60) - 30;
                    let addY = Math.floor(Math.random()*60) - 30;
                    curTilePosition.addSelf(cc.v2(addX, addY));
                }
                curTile.addPeople(self.node);
                self.node.runAction(cc.sequence(
                    cc.moveTo(self.moveTime, curTilePosition),
                    cc.callFunc(function () {
                        let nextTile = movePathTiles[i+1];
                        if(nextTile && nextTile.isCanCross()){
                            let nextTilePosition = self.aStarMap.getCenterByTilePos(nextTile.position);
                            let curTileBorder = curTilePosition.add(nextTilePosition.sub(curTilePosition).divSelf(2.1));
                            self.node.runAction(cc.sequence(
                                cc.moveTo(self.moveTime, curTileBorder),
                                cc.callFunc(function () {
                                    curTile.removePeople(self.node);
                                    moveAction();
                                })
                            ));
                        }else {
                            moveAction();
                        }
                    })
                ));
            }else {
                if(moveCb) moveCb();
            }
        };
        moveAction();
    },
    
    //移动到坐标点
    moveToPostion: function (position, moveCb) {
        let distancePoint = self.node.position.sub(position);
        let moveTime = (Math.abs(distancePoint.x) + Math.abs(distancePoint.y))/self.moveSpeed;

    }
});

module.exports = NpcPlayer;
