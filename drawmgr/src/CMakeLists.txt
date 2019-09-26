project(drawmgr)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)

add_contract( drawmgr drawmgr drawmgr.cpp )
target_include_directories( drawmgr PUBLIC ${CMAKE_SOURCE_DIR}/../include )
