#!/bin/sh

DBNAME=wtfc
DBURL=http://localhost:5984/${DBNAME}

kanso install

kanso push ${DBURL}
