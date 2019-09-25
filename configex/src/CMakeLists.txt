project(configex)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)

add_contract( configex configex configex.cpp )
target_include_directories( configex PUBLIC ${CMAKE_SOURCE_DIR}/../include )