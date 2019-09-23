
## configex Project
### Purpose
Illustrate how to setup and manage a contract configuration singleton

#### Creation / Init
This project was created using:
```
eosio-init -project=configex -path=.
```

It uses ```cmake``` to build the project.

The boilerplate project from ```eosio-init``` does not include a ```.gitignore``` file so I have added a useful one to the project.



--- configex Project ---

 - How to Build -
   - run the command 'cmake .'
   - run the command 'make'

 - After build -
   - The built smart contract is under the 'configex' directory in the 'build' directory
   - You can then do a 'set contract' action with 'cleos' and point in to the './build/configex' directory

 - Additions to CMake should be done to the CMakeLists.txt in the './src' directory and not in the top level CMakeLists.txt