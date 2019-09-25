project(depositmgr)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)

add_contract( depositmgr depositmgr depositmgr.cpp )
target_include_directories( depositmgr PUBLIC ${CMAKE_SOURCE_DIR}/../include )
