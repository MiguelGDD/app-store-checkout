cmake_minimum_required(VERSION 3.13)

project(appmodules)

include(${REACT_ANDROID_DIR}/cmake-utils/ReactNative-application.cmake)

find_library(ANDROID_CPP_SHARED_LIBRARY c++_shared)
if(ANDROID_CPP_SHARED_LIBRARY)
    target_link_libraries(${CMAKE_PROJECT_NAME} ${ANDROID_CPP_SHARED_LIBRARY})
endif()
