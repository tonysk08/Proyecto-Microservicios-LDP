/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/catalog-service/src/catalog-service.controller.ts"
/*!****************************************************************!*\
  !*** ./apps/catalog-service/src/catalog-service.controller.ts ***!
  \****************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CatalogServiceController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const catalog_service_service_1 = __webpack_require__(/*! ./catalog-service.service */ "./apps/catalog-service/src/catalog-service.service.ts");
let CatalogServiceController = class CatalogServiceController {
    catalogServiceService;
    constructor(catalogServiceService) {
        this.catalogServiceService = catalogServiceService;
    }
    getHello() {
        return this.catalogServiceService.getHello();
    }
};
exports.CatalogServiceController = CatalogServiceController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], CatalogServiceController.prototype, "getHello", null);
exports.CatalogServiceController = CatalogServiceController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof catalog_service_service_1.CatalogServiceService !== "undefined" && catalog_service_service_1.CatalogServiceService) === "function" ? _a : Object])
], CatalogServiceController);


/***/ },

/***/ "./apps/catalog-service/src/catalog-service.module.ts"
/*!************************************************************!*\
  !*** ./apps/catalog-service/src/catalog-service.module.ts ***!
  \************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CatalogServiceModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const catalog_service_controller_1 = __webpack_require__(/*! ./catalog-service.controller */ "./apps/catalog-service/src/catalog-service.controller.ts");
const catalog_service_service_1 = __webpack_require__(/*! ./catalog-service.service */ "./apps/catalog-service/src/catalog-service.service.ts");
let CatalogServiceModule = class CatalogServiceModule {
};
exports.CatalogServiceModule = CatalogServiceModule;
exports.CatalogServiceModule = CatalogServiceModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [catalog_service_controller_1.CatalogServiceController],
        providers: [catalog_service_service_1.CatalogServiceService],
    })
], CatalogServiceModule);


/***/ },

/***/ "./apps/catalog-service/src/catalog-service.service.ts"
/*!*************************************************************!*\
  !*** ./apps/catalog-service/src/catalog-service.service.ts ***!
  \*************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CatalogServiceService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let CatalogServiceService = class CatalogServiceService {
    getHello() {
        return 'Hello World! <br> CATALOG-SERVICE';
    }
};
exports.CatalogServiceService = CatalogServiceService;
exports.CatalogServiceService = CatalogServiceService = __decorate([
    (0, common_1.Injectable)()
], CatalogServiceService);


/***/ },

/***/ "@nestjs/common"
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
(module) {

module.exports = require("@nestjs/common");

/***/ },

/***/ "@nestjs/core"
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
(module) {

module.exports = require("@nestjs/core");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!******************************************!*\
  !*** ./apps/catalog-service/src/main.ts ***!
  \******************************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const catalog_service_module_1 = __webpack_require__(/*! ./catalog-service.module */ "./apps/catalog-service/src/catalog-service.module.ts");
async function bootstrap() {
    const app = await core_1.NestFactory.create(catalog_service_module_1.CatalogServiceModule);
    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();

})();

/******/ })()
;