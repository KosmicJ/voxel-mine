// Generated by CoffeeScript 1.6.3
(function() {
  var EventEmitter, Mine,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter = (require('events')).EventEmitter;

  module.exports = function(game, opts) {
    return new Mine(game, opts);
  };

  Mine = (function(_super) {
    __extends(Mine, _super);

    function Mine(game, opts) {
      var _ref,
        _this = this;
      this.game = game;
      opts = opts != null ? opts : {};
      if (opts.timeToMine == null) {
        opts.timeToMine = function(voxel) {
          return 9;
        };
      }
      if (opts.instaMine == null) {
        opts.instaMine = false;
      }
      if (opts.progressTexturesPrefix == null) {
        opts.progressTexturesPrefix = void 0;
      }
      if (opts.progressTexturesExt == null) {
        opts.progressTexturesExt = ".png";
      }
      if (opts.progressTexturesCount == null) {
        opts.progressTexturesCount = 10;
      }
      if (opts.applyTextureParams == null) {
        opts.applyTextureParams = function(texture) {
          texture.magFilter = _this.game.THREE.NearestFilter;
          texture.minFilter = _this.game.THREE.LinearMipMapLinearFilter;
          texture.wrapT = _this.game.THREE.RepeatWrapping;
          return texture.wrapS = _this.game.THREE.RepeatWrapping;
        };
      }
      this.reach = (function() {
        if ((_ref = opts.reach) != null) {
          return _ref;
        } else {
          throw "voxel-mine requires 'reach' option set to voxel-reach instance";
        }
      })();
      this.opts = opts;
      this.instaMine = opts.instaMine;
      this.progress = 0;
      this.texturesEnabled = this.opts.progressTexturesPrefix != null;
      this.overlay = null;
      this.setupTextures();
      this.enable();
    }

    return Mine;

  })(EventEmitter);

  Mine.prototype.enable = function() {
    var _this = this;
    this.reach.on('mining', this.onMining = function(target) {
      var hardness;
      if (!target) {
        console.log("no block mined");
        return;
      }
      _this.progress += 1;
      hardness = _this.opts.timeToMine(target);
      if (_this.instaMine || _this.progress > hardness) {
        _this.progress = 0;
        _this.reach.emit('stop mining', target);
        _this.emit('break', target);
      }
      return _this.updateForStage(_this.progress, hardness);
    });
    this.reach.on('start mining', this.onStartMining = function(target) {
      if (!target) {
        return;
      }
      return _this.createOverlay(target);
    });
    return this.reach.on('stop mining', this.onStopMining = function(target) {
      if (!target) {
        return;
      }
      _this.destroyOverlay();
      return _this.progress = 0;
    });
  };

  Mine.prototype.disable = function() {
    this.reach.removeListener('mining', this.onMining);
    this.reach.removeListener('start mining', this.onStartMining);
    return this.reach.removeListener('stop mining', this.onStopMining);
  };

  Mine.prototype.setupTextures = function() {
    var i, path, _i, _ref, _ref1, _results;
    if (!this.texturesEnabled) {
      return;
    }
    this.progressTextures = [];
    _results = [];
    for (i = _i = 0, _ref = this.opts.progressTexturesCount; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      path = ((_ref1 = this.game.materials.texturePath) != null ? _ref1 : '') + this.opts.progressTexturesPrefix + i + this.opts.progressTexturesExt;
      _results.push(this.progressTextures.push(this.game.THREE.ImageUtils.loadTexture(path)));
    }
    return _results;
  };

  Mine.prototype.createOverlay = function(target) {
    var geometry, material, mesh, offset;
    if (this.instaMine || !this.texturesEnabled) {
      return;
    }
    this.destroyOverlay();
    geometry = new this.game.THREE.Geometry();
    if (target.normal[2] === 1) {
      geometry.vertices.push(new this.game.THREE.Vector3(0, 0, 0));
      geometry.vertices.push(new this.game.THREE.Vector3(1, 0, 0));
      geometry.vertices.push(new this.game.THREE.Vector3(1, 1, 0));
      geometry.vertices.push(new this.game.THREE.Vector3(0, 1, 0));
      offset = [0, 0, 1];
    } else if (target.normal[1] === 1) {
      geometry.vertices.push(new this.game.THREE.Vector3(0, 0, 0));
      geometry.vertices.push(new this.game.THREE.Vector3(0, 0, 1));
      geometry.vertices.push(new this.game.THREE.Vector3(1, 0, 1));
      geometry.vertices.push(new this.game.THREE.Vector3(1, 0, 0));
      offset = [0, 1, 0];
    } else if (target.normal[0] === 1) {
      geometry.vertices.push(new this.game.THREE.Vector3(0, 0, 0));
      geometry.vertices.push(new this.game.THREE.Vector3(0, 1, 0));
      geometry.vertices.push(new this.game.THREE.Vector3(0, 1, 1));
      geometry.vertices.push(new this.game.THREE.Vector3(0, 0, 1));
      offset = [1, 0, 0];
    } else if (target.normal[0] === -1) {
      geometry.vertices.push(new this.game.THREE.Vector3(0, 0, 0));
      geometry.vertices.push(new this.game.THREE.Vector3(0, 0, 1));
      geometry.vertices.push(new this.game.THREE.Vector3(0, 1, 1));
      geometry.vertices.push(new this.game.THREE.Vector3(0, 1, 0));
      offset = [0, 0, 0];
    } else if (target.normal[1] === -1) {
      geometry.vertices.push(new this.game.THREE.Vector3(0, 0, 0));
      geometry.vertices.push(new this.game.THREE.Vector3(1, 0, 0));
      geometry.vertices.push(new this.game.THREE.Vector3(1, 0, 1));
      geometry.vertices.push(new this.game.THREE.Vector3(0, 0, 1));
      offset = [0, 0, 0];
    } else if (target.normal[2] === -1) {
      geometry.vertices.push(new this.game.THREE.Vector3(0, 0, 0));
      geometry.vertices.push(new this.game.THREE.Vector3(0, 1, 0));
      geometry.vertices.push(new this.game.THREE.Vector3(1, 1, 0));
      geometry.vertices.push(new this.game.THREE.Vector3(1, 0, 0));
      offset = [0, 0, 0];
    } else {
      console.log("unknown face", target.normal);
      return;
    }
    geometry.faces.push(new this.game.THREE.Face3(0, 1, 2));
    geometry.faces.push(new this.game.THREE.Face3(0, 2, 3));
    geometry.computeCentroids();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.faceVertexUvs = [
      [
        [
          {
            x: 0,
            y: 0
          }, {
            x: 1,
            y: 0
          }, {
            x: 1,
            y: 1
          }, {
            x: 0,
            y: 1
          }
        ], [
          {
            x: 0,
            y: 0
          }, {
            x: 1,
            y: 1
          }, {
            x: 0,
            y: 1
          }, {
            x: 0,
            y: 1
          }
        ]
      ]
    ];
    material = new this.game.THREE.MeshLambertMaterial();
    material.map = this.progressTextures[0];
    this.opts.applyTextureParams(material.map);
    material.side = this.game.THREE.FrontSide;
    material.transparent = true;
    material.polygonOffset = true;
    material.polygonOffsetFactor = -1.0;
    material.polygonOffsetUnits = -1.0;
    mesh = new this.game.THREE.Mesh(geometry, material);
    this.overlay = new this.game.THREE.Object3D();
    this.overlay.add(mesh);
    this.overlay.position.set(target.voxel[0] + offset[0], target.voxel[1] + offset[1], target.voxel[2] + offset[2]);
    this.game.scene.add(this.overlay);
    return this.overlay;
  };

  Mine.prototype.updateForStage = function(progress, hardness) {
    var index, texture;
    if (!this.texturesEnabled) {
      return;
    }
    index = Math.floor((progress / hardness) * (this.progressTextures.length - 1));
    texture = this.progressTextures[index];
    return this.setOverlayTexture(texture);
  };

  Mine.prototype.setOverlayTexture = function(texture) {
    if (!this.overlay || !this.texturesEnabled) {
      return;
    }
    this.opts.applyTextureParams(texture);
    this.overlay.children[0].material.map = texture;
    return this.overlay.children[0].material.needsUpdate = true;
  };

  Mine.prototype.destroyOverlay = function() {
    if (!this.overlay || !this.texturesEnabled) {
      return;
    }
    this.game.scene.remove(this.overlay);
    return this.overlay = null;
  };

}).call(this);
