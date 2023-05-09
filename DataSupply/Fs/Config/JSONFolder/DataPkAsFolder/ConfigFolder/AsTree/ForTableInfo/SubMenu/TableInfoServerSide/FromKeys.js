// let CommonFromUserFolder = require("../../../../UserFolder/getDirectories");
// let CommonFromgetDirectories = require("../../../../getDirectories");

let CommonFromUserFolder = require("../../../../UserFolder/getDirectories");
let CommonFromgetDirectories = require("../../../../getDirectories");
// let CommonFromCompleteJson = require("../../../../getDirectories");

let _ = require("lodash");

let AsObject = async ({ inDataPK }) => {
    let LocalDataPK = inDataPK;
    let LocalReturnObject = {};
    LocalReturnObject.Folders = {};

    let LocalArray = CommonFromgetDirectories.StartFunc({ inDataPK: LocalDataPK });

    const result = await Promise.all(LocalArray.map(async (file) => {
        let LoopInsideFile = await CommonFromUserFolder.AsObjects({
            inFolderName: file,
            inDataPK: LocalDataPK
        });

        return await {
            FolderName: file,
            Files: LoopInsideFile
        };
    }));

    let LocalAltered = result.map(element => {
        let LoopInsideFile = JSON.parse(JSON.stringify(element));
        LoopInsideFile.Files = {};

        Object.entries(element.Files).forEach(
            ([FileKey, FileValue]) => {
                LoopInsideFile.Files[FileKey] = JSON.parse(JSON.stringify(FileValue));

                Object.entries(FileValue.Items).forEach(
                    ([ItemKey, ItemValue]) => {
                        LoopInsideFile.Files[FileKey].Items[ItemKey] = JSON.parse(JSON.stringify(ItemValue));

                        Object.entries(ItemValue.Screens).forEach(
                            ([ScreenKey, ScreenValue]) => {
                                delete ScreenValue.TableColumnsObject;

                                if ("TableInfo" in ScreenValue) {

                                    ScreenValue.TransformToUi = ScreenValue.TableInfo.TableInfoServerSide.TransformToUi;
                                    ScreenValue.TransformFromReports = ScreenValue.TableInfo.TableInfoServerSide.TransformFromReports;

                                }
                                LoopInsideFile.Files[FileKey].Items[ItemKey].Screens[ScreenKey] = JSON.parse(JSON.stringify(ScreenValue));

                            }
                        );
                    }
                );
            }
        );

        return LoopInsideFile;
    });

    //  console.log("result---------- : ", LocalAltered[0].Files.Accounts.Items.Accounts.Screens.Create.TableColumnsObject.pk);

    LocalAltered.forEach(element => {
        LocalReturnObject.Folders[element.FolderName] = element;
    });

    return await LocalReturnObject;
};

let AsObjectFromCommonCode = async ({ inDataPK }) => {
    let LocalDataPK = inDataPK;
    // let LocalReturnObject = {};
    // LocalReturnObject.Folders = {};

    let LocalFromCommon = await CommonFromgetDirectories.AsObject({ inDataPK: LocalDataPK });

    Object.entries(LocalFromCommon.Folders).forEach(
        ([KeyForFolder, ValueForFolder]) => {
            Object.entries(ValueForFolder.Files).forEach(
                ([KeyForFiles, ValueForFiles]) => {
                    Object.entries(ValueForFiles.Items).forEach(
                        ([KeyForItems, ValueForItems]) => {
                            Object.entries(ValueForItems.Screens).forEach(
                                ([KeyForScreens, ValueForScreens]) => {
                                    delete ValueForScreens.ReturnDataJsonContent;
                                    delete ValueForScreens.SubTableColumnsObject;
                                    delete ValueForScreens.SubTableInfo;
                                    delete ValueForScreens.TableColumnsObject;
                                }
                            );
                        }
                    );
                }
            );
        }
    );

    return await LocalFromCommon;
};

let LocalMockFunc = async () => {
    let LocalData = await AsObjectFromCommonCode({ inDataPK: 1022 });
};

// LocalMockFunc().then();

module.exports = { AsObject, AsObjectFromCommonCode };
