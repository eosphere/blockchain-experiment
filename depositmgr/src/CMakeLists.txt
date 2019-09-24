cmake_minimum_required(VERSION 3.13)
project(depositmgr)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)

add_subdirectory(token)
add_subdirectory(depositmgr)
