project(experiment)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)

add_contract( experiment experiment experiment.cpp )
target_include_directories( experiment PUBLIC ${CMAKE_SOURCE_DIR}/../include )
